"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	loadEdiFixture,
	loadEdiByPath
} from "../api/ediApi";

const domain = "claim-encounter-edi";

export * from "../types/ediModel";
