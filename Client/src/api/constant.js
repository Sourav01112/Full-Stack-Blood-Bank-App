
// Production
// export const urlBaseUsers = 'https://rich-ruby-sturgeon-garb.cyclic.app/api/users/'
// export const urlBaseInventory = 'https://rich-ruby-sturgeon-garb.cyclic.app/api/inventory/'


/*  Local */

export const urlBaseUsers = 'http://192.168.0.105:4500/api/users/'
export const urlBaseInventory = 'http://192.168.0.105:4500/api/inventory/'


// Users
export const register = urlBaseUsers + 'register'
export const login = urlBaseUsers + 'login'
export const getcurrentuser = urlBaseUsers + 'get-current-user'
export const getAllDonorsOfOrg = urlBaseUsers + 'get-all-donors'
export const getAllHospOfOrg = urlBaseUsers + 'get-all-hospitals'



export const getAllOrgForDonor = urlBaseUsers + 'get-all-org-for-donor'
export const getAllOrgForHospital = urlBaseUsers + 'get-all-org-for-hospital'



// Inventory
export const addInventory = urlBaseInventory + 'addInventory'
export const getInventory = urlBaseInventory + 'getInventory'
export const getInventoryWithFilters = urlBaseInventory + 'getInventory-filter'





