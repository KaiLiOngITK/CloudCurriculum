FROM python:latest

WORKDIR /shipment-services

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8083

CMD [ "python3", "app.py" ]