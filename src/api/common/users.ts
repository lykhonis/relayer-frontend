import { supabase } from 'api/utils/supabase'
import { definitions } from 'types/supabase'

export const USER_CYCLE_MAX_TRANSACTIONS = 100

const getResetDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1)

export const updateUserQuota = async (profile: string, quotaUsed?: number) => {
  const { error } = await supabase
    .from<definitions['users']>('users')
    .update({ quota_used: quotaUsed })
    .eq('profile', profile.toLowerCase())
    .single()
  if (error) {
    throw new Error(error?.message)
  }
}

export const requestUserQuota = async (profile: string) => {
  // poll existing user's quota
  {
    const { data, error } = await supabase
      .from<definitions['users']>('users')
      .select('quota_used,quota_start_date')
      .eq('profile', profile.toLowerCase())
      .maybeSingle()
    if (error) {
      throw new Error(error.message)
    } else if (data) {
      const startDate = new Date(data.quota_start_date)
      const resetDate = getResetDate(startDate)
      let quota = USER_CYCLE_MAX_TRANSACTIONS - data.quota_used
      if (new Date() >= resetDate) {
        const { error: updatedError } = await supabase
          .from<definitions['users']>('users')
          .update({
            quota_used: 0,
            quota_start_date: resetDate.toISOString()
          })
          .eq('profile', profile.toLowerCase())
          .single()
        if (updatedError) {
          throw new Error(updatedError.message)
        }
        quota = USER_CYCLE_MAX_TRANSACTIONS
      }
      return {
        quota,
        totalQuota: USER_CYCLE_MAX_TRANSACTIONS,
        resetDate: getResetDate(startDate).getTime()
      }
    }
  }
  // new user's quota
  {
    const { data, error } = await supabase
      .from<definitions['users']>('users')
      .insert({ profile: profile.toLowerCase() })
      .single()
    if (!data || error) {
      console.error(error?.message)
      throw new Error(error?.message)
    }
    const startDate = new Date(data.quota_start_date)
    return {
      quota: USER_CYCLE_MAX_TRANSACTIONS,
      totalQuota: USER_CYCLE_MAX_TRANSACTIONS,
      resetDate: getResetDate(startDate).getTime()
    }
  }
}
