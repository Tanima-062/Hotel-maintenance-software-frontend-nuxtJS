/*
 * キャンセルポリシー用のstore
 */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

export interface CancelPolicyState {
  cancelPolicyId: number | null
}

@Module({ stateFactory: true, namespaced: true, name: 'cancelPolicy' })
export default class extends VuexModule implements CancelPolicyState {
  cancelPolicyId: number | null = null

  get currentCancelPolicyId(): number | null {
    return this.cancelPolicyId
  }

  @Mutation
  public SET_CANCEL_POLICY_ID(id: number | null): void {
    this.cancelPolicyId = id
  }

  @Action({ rawError: true })
  setCancelPolicyId(id: number | null) {
    this.SET_CANCEL_POLICY_ID(id)
  }
}
