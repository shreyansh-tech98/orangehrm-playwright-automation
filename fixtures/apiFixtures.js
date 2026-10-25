import {test as base ,expect, request} from '@playwright/test'


export const test = base.extend({
    apiContext : async({},use)=>{
        const context = await request.newContext({
            baseURL : process.env.API_BASE_URL,
            storageState : 'config/.auth/user.json'

        })
        await use(context)
        await context.dispose()
    }
})

export {expect} 