import CacheInterface from "@/domain/cache-interface";
import UserRepository from "@/domain/user-repository";
import HttpRequestInterface from "@/domain/user-role/http-request-interface";
import { inject } from "vue";

export function useDependencyInjection() {
  const httpRequest = inject<HttpRequestInterface>("httpRequest")!;
  const userRepository = inject<UserRepository>("userRepository")!;
  const cache = inject<CacheInterface>("cache")!;

  return { httpRequest, userRepository, cache };
}
