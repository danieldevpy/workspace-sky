FROM python:3.12.10-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev pkg-config default-libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:80", "--noreload"]