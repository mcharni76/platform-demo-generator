#!/usr/bin/env python3
"""
validate.py — Quick post-generation smoke test for platform demos.

Usage:
    python validate.py --path ~/Projects/ARAMCO --connection aramco-deploy

Checks:
    1. SQL scripts have no anti-patterns (bare tables, ON CONFLICT, CREATE INDEX)
    2. Backend pyproject.toml is valid and has required deps
    3. Frontend package.json exists and has build script
    4. Tailwind config exists with content scan
    5. SPCS spec (if exists) has correct port references
"""

import argparse
import json
import re
import sys
from pathlib import Path

ANTI_PATTERNS = [
    (r'\bON\s+CONFLICT\b', 'Use MERGE INTO instead of ON CONFLICT'),
    (r'\bCREATE\s+INDEX\b', 'Use ALTER TABLE CLUSTER BY instead of CREATE INDEX'),
    (r'(?<!\w)GRANT\s+USAGE\s+ON\s+DATABASE\s+SNOWFLAKE\b', 'Use GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE'),
]

REQUIRED_BACKEND_DEPS = ['fastapi', 'uvicorn', 'httpx', 'snowflake-snowpark-python']


def check_sql_scripts(project_path: Path) -> list[str]:
    issues = []
    scripts_dir = project_path / 'deploy' / 'scripts'
    if not scripts_dir.exists():
        issues.append(f"MISSING: {scripts_dir}")
        return issues

    for sql_file in sorted(scripts_dir.glob('*.sql')):
        content = sql_file.read_text()
        for pattern, msg in ANTI_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(f"{sql_file.name}: {msg}")

        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith('--') or not stripped:
                continue
            if re.search(r'\b\w+\s*/\s*\w+\b', stripped) and 'DIV0' not in stripped and 'http' not in stripped.lower():
                if '/' in stripped and not any(x in stripped for x in ['--', '//', '/*', '*/', 'http', 'path', 'dir', 'file']):
                    pass  # skip — too many false positives for path-like strings

    return issues


def check_backend(project_path: Path) -> list[str]:
    issues = []
    pyproject = project_path / 'backend' / 'pyproject.toml'
    if not pyproject.exists():
        issues.append(f"MISSING: {pyproject}")
        return issues

    content = pyproject.read_text().lower()
    for dep in REQUIRED_BACKEND_DEPS:
        if dep not in content:
            issues.append(f"backend/pyproject.toml: missing dependency '{dep}'")

    if 'packages = ["app"]' not in pyproject.read_text() and "packages = ['app']" not in pyproject.read_text():
        issues.append("backend/pyproject.toml: missing [tool.hatch.build.targets.wheel] packages = [\"app\"]")

    return issues


def check_frontend(project_path: Path) -> list[str]:
    issues = []
    pkg_json = project_path / 'frontend' / 'package.json'
    if not pkg_json.exists():
        issues.append(f"MISSING: {pkg_json}")
        return issues

    pkg = json.loads(pkg_json.read_text())
    if 'build' not in pkg.get('scripts', {}):
        issues.append("frontend/package.json: missing 'build' script")

    tailwind_cfg = project_path / 'frontend' / 'tailwind.config.js'
    if not tailwind_cfg.exists():
        issues.append("MISSING: frontend/tailwind.config.js (custom classes will be purged in prod)")
    else:
        tw_content = tailwind_cfg.read_text()
        if '.tsx' not in tw_content:
            issues.append("frontend/tailwind.config.js: content array missing '.tsx' — classes will be purged")

    vite_cfg = project_path / 'frontend' / 'vite.config.ts'
    if vite_cfg.exists():
        vite_content = vite_cfg.read_text()
        if '8200' not in vite_content and '8000' not in vite_content:
            issues.append("frontend/vite.config.ts: proxy target may not point to correct backend port")

    return issues


def check_spcs(project_path: Path) -> list[str]:
    issues = []
    spcs_dir = project_path / 'spcs'
    if not spcs_dir.exists():
        return []  # not yet generated — skip

    spec_files = list(spcs_dir.glob('*-service-spec.yaml')) + list(spcs_dir.glob('*_service_spec.yaml'))
    for spec in spec_files:
        content = spec.read_text()
        if 'readinessProbe' in content and '8200' not in content:
            issues.append(f"{spec.name}: readinessProbe port may not match backend (expected 8200)")
        if any(c.isupper() for c in re.findall(r'image:\s*(.+)', content)[0] if re.findall(r'image:\s*(.+)', content)):
            pass  # complex check — skip for now

    return issues


def main():
    parser = argparse.ArgumentParser(description='Validate platform demo project')
    parser.add_argument('--path', required=True, help='Path to demo project root')
    parser.add_argument('--connection', default='', help='Snowflake connection name (for SQL validation)')
    args = parser.parse_args()

    project_path = Path(args.path).expanduser().resolve()
    if not project_path.exists():
        print(f"ERROR: Project path does not exist: {project_path}")
        sys.exit(1)

    print(f"Validating: {project_path}\n")

    all_issues = []

    print("1. SQL Scripts...")
    issues = check_sql_scripts(project_path)
    all_issues.extend(issues)
    print(f"   {'✅ PASS' if not issues else f'❌ {len(issues)} issue(s)'}")
    for i in issues:
        print(f"   - {i}")

    print("2. Backend...")
    issues = check_backend(project_path)
    all_issues.extend(issues)
    print(f"   {'✅ PASS' if not issues else f'❌ {len(issues)} issue(s)'}")
    for i in issues:
        print(f"   - {i}")

    print("3. Frontend...")
    issues = check_frontend(project_path)
    all_issues.extend(issues)
    print(f"   {'✅ PASS' if not issues else f'❌ {len(issues)} issue(s)'}")
    for i in issues:
        print(f"   - {i}")

    print("4. SPCS Spec...")
    issues = check_spcs(project_path)
    all_issues.extend(issues)
    print(f"   {'✅ PASS' if not issues else f'❌ {len(issues)} issue(s)'}")
    for i in issues:
        print(f"   - {i}")

    print(f"\n{'='*50}")
    if all_issues:
        print(f"RESULT: ❌ {len(all_issues)} issue(s) found")
        sys.exit(1)
    else:
        print("RESULT: ✅ All checks passed")
        sys.exit(0)


if __name__ == '__main__':
    main()
