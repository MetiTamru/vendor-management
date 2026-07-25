# Delegates to infra/Makefile — run `make dev`, `make deploy`, etc. from repo root
.PHONY: %
%:
	@$(MAKE) -C infra $@
