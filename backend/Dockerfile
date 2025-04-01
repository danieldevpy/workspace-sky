FROM python:3.12.9

RUN apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "--noreload"]