SHELL := /bin/bash
.PHONY: help requirements clean build test pkg

help: main.help

main.help:
	@echo ''
	@echo 'Makefile for the mitm'
	@echo ''
	@echo 'Usage:'
	@echo '    make sync                      deploy'
	@echo ''

sync:
	rsync -avz -e 'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null' --progress ./src namle@vt02.lehongnam.com:/home/namle/slow/kqxs/
