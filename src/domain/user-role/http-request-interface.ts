import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export default interface HttpRequestInterface {
  mutate<ResponseType = any>(
    context: string,
    options: GraphqlBuilderOptions,
    token?: string | undefined
  ): Promise<ResponseType>;

  query<ResponseType = any>(
    context: string,
    options: GraphqlBuilderOptions,
    token?: string | undefined
  ): Promise<ResponseType>;
}
