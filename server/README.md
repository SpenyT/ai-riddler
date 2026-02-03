## Development

Creating/Activating venv:
```
python -m venv venv
# on window:
venv\Scripts\activate

#on mac:
source venv/bin/activate
```

Install project dependencies:
```
cd server
pip install -r "requirements.txt"
```

.env file:
Please refer to .env.example file for sructure of .env file.

Running server:
```
# from ./ai-riddler/server
uvicorn app.main:app --reload
```

To run tests:
```
python -m app.tests.mongo_test
```