import { AbilityBuilder, Ability } from '@casl/ability'
import permission from '../lib/permission.json'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: number[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  permission.forEach(item => {
    if (role?.includes(item.id)) {
      can('read', 'homepage')
      can(item.action, item.subject)
    }
  })

  return rules
}

export const buildAbilityFor = (role: number[]): AppAbility => {
  return new AppAbility(defineRulesFor(role), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
