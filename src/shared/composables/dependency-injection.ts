import AdminRepository from "@/admin-bc/role/admin-repository";
import CompanyUserRepository from "@/company-bc/role/company-user-repository";
import CacheInterface from "@/infrastructure/cache-interface";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import ManagerRepository from "@/manager-bc/role/manager-repository";
import SalesRepository from "@/sales-bc/role/sales-repository";
import { inject } from "vue";

export function useDependencyInjection() {
  const httpRequest = inject<HttpRequestInterface>("httpRequest")!;
  const restRequest = inject<RestRequestInterface>("restRequest")!;
  const companyUserRepository = inject<CompanyUserRepository>(
    "companyUserRepository"
  )!;
  const adminRepository = inject<AdminRepository>("adminRepository")!;
  const managerRepository = inject<ManagerRepository>("managerRepository")!;
  const salesRepository = inject<SalesRepository>("salesRepository")!;
  const cache = inject<CacheInterface>("cache")!;

  return {
    httpRequest,
    restRequest,
    cache,
    companyUserRepository,
    adminRepository,
    salesRepository,
    managerRepository,
  };
}
