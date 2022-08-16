import BaseService from "./base.service";

export default class OpportunityService extends BaseService {
  async getOpportunitiesByAccount(accountId: string, lastEvaluatedKey?: any) {
    let query = `/opportunity/list/public/account/${accountId}`;

    const params = lastEvaluatedKey
      ? {
          id: lastEvaluatedKey.id,
          accountId: lastEvaluatedKey.accountId,
          createdAt: lastEvaluatedKey.createdAt,
        }
      : null;

    const resp = await this.client.get(query, {
      params: params,
    });

    return resp.data;
  }
}
