DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/python" >/dev/null 2>&1 && pwd )"
cd "$DIR"
python3 -m venv ao3-env
source "${DIR}/ao3-env/bin/activate"
python3 -m pip install --upgrade pip
python3 -m pip install -r ../requirements.txt
deactivate