import CompanyUserRepository from "@/company-bc/role/company-user-repository";
import CacheInterface from "@/infrastructure/cache-interface";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import SalesRepository from "@/sales-bc/role/sales-repository";
import UserRepository from "@/user-bc/role/user-repository";
import { inject } from "vue";

export function useDependencyInjection() {
  const httpRequest = inject<HttpRequestInterface>("httpRequest")!;
  const restRequest = inject<RestRequestInterface>("restRequest")!;
  const userRepository = inject<UserRepository>("userRepository")!;
  const companyUserRepository = inject<CompanyUserRepository>("companyUserRepository")!;
  const salesRepository = inject<SalesRepository>("salesRepository")!;
  const cache = inject<CacheInterface>("cache")!;

  return { httpRequest, restRequest, userRepository, cache, companyUserRepository, salesRepository };
}
