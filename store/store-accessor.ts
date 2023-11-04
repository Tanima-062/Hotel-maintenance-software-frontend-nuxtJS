import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Account from '~/store/account'
import RoomAndPlan from '~/store/roomAndPlan'
import CancelPolicy from '~/store/cancelPolicy'

let accountStore: Account // eslint-disable-line
let roomAndPlanStore: RoomAndPlan // eslint-disable-line
let cancelPolicyStore: CancelPolicy // eslint-disable-line

const initialiseStores = (store: Store<Object>): void => {
  accountStore = getModule(Account, store)
  roomAndPlanStore = getModule(RoomAndPlan, store)
  cancelPolicyStore = getModule(CancelPolicy, store)
}

export { initialiseStores, accountStore, roomAndPlanStore, cancelPolicyStore }
