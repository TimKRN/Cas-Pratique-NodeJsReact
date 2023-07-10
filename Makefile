ORG = pierrea
SHA1 = $(shell git log -1 --pretty=oneline | cut -c-10)
BRANCH = $(shell git branch -a --contains $(SHA1) | egrep '(remotes/|\*)' | egrep -v "(HEAD|detached)" | head -1 | sed -e "s/\* //" -e "s/.*\///")
VERSION = $(BRANCH)-$(SHA1)
# REGISTRY =  registry.digitalocean.com

# build_app:
# 	docker build -t $(ORG)/reactfront:${VERSION} .
# 	docker tag $(ORG)/reactfront:${VERSION} $(ORG)/reactfront:$(BRANCH)-latest
# 	# docker tag $(ORG)/reactfront:${VERSION} $(REGISTRY)/$(ORG)/reactfront:${VERSION}
# 	# docker tag $(ORG)/reactfront:${VERSION} $(REGISTRY)/$(ORG)/reactfront:$(BRANCH)-latest

build_db:
	docker build -f Dockerfile.postgres -t $(ORG)/postgres-reactfront:${VERSION} .
	docker tag $(ORG)/postgres-reactfront:${VERSION} $(ORG)/postgres-reactfront:$(BRANCH)-latest
	# docker tag $(ORG)/postgres-reactfront:${VERSION} $(REGISTRY)/$(ORG)/postgres-reactfront:${VERSION}
	# docker tag $(ORG)/postgres-reactfront:${VERSION} $(REGISTRY)/$(ORG)/postgres-reactfront:$(BRANCH)-latest

front:
	cd frontendReact && \
	REACT_APP_DIRECTUS_URL=http://localhost:8055 REACT_APP_BACKEND_URL=http://localhost:3001 npm run build

build_front_docker:
	cd frontendReact && \
	REACT_APP_DIRECTUS_URL=https://directus.demo1.kitt.avizou.eu REACT_APP_BACKEND_URL=https://back.demo1.kitt.avizou.eu npm run build && \
	docker build -f Dockerfile -t $(ORG)/reactfront:${VERSION} .
	docker tag $(ORG)/reactfront:${VERSION} $(ORG)/reactfront:$(BRANCH)-latest

build_back_docker:
	cd backend && \
	docker build -f Dockerfile -t $(ORG)/nodebackend:${VERSION} .
	docker tag $(ORG)/nodebackend:${VERSION} $(ORG)/nodebackend:$(BRANCH)-latest

deploy:
	docker stack deploy --compose-file=docker-compose.yml ractools