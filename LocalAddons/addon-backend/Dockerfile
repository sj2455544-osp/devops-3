
FROM python:3.13-slim


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app


RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . .


RUN python manage.py collectstatic --noinput
EXPOSE 8000

CMD ["uvicorn", "backend.wsgi:application", "--host", "0.0.0.0", "--port", "8000"]
