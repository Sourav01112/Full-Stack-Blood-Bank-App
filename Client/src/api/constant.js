
// Production
export const urlBase = 'https://rich-ruby-sturgeon-garb.cyclic.app/api/'



/*  Local */

// export const urlBase = 'http://192.168.0.105:4500/api/'


// Users
export const register = urlBase + 'users/register'
export const login = urlBase + 'users/login'

export const forgotPassword = urlBase + 'users/forgotPassword'
export const resetPassword = urlBase + 'users/resetPassword'
// export const log3in = urlBase + 'users/login'
// export const logrin = urlBase + 'users/login'




export const getcurrentuser = urlBase + 'users/get-current-user'
export const getAllDonorsOfOrg = urlBase + 'users/get-all-donors'
export const getAllHospOfOrg = urlBase + 'users/get-all-hospitals'
export const getAllOrgForDonor = urlBase + 'users/get-all-org-for-donor'
export const getAllOrgForHospital = urlBase + 'users/get-all-org-for-hospital'



// Inventory
export const addInventory = urlBase + 'inventory/addInventory'
export const getInventory = urlBase + 'inventory/getInventory'
export const getInventoryWithFilters = urlBase + 'inventory/getInventory-filter'


// Dashboard

export const getAllBloodData = urlBase + 'dashboard/bloodGroup-data-all'







