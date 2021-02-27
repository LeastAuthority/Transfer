FROM python:3.9.1-buster

COPY Pipfile /app/Pipfile
COPY ./Pipfile.lock /app/Pipfile.lock

RUN pip install pipenv
WORKDIR /app
RUN pipenv install

RUN bash -c "cat >>/root/.bashrc <<EOF \
\
function dev_server { \
    pip install -e . && pipenv run twist transitrelay \
} \
export -f dev_server \
EOF; cat $HOME/.bashrc"

CMD bash -c "pipenv run twist transitrelay"
