
// Production
export const urlBaseUsers = 'https://rich-ruby-sturgeon-garb.cyclic.app/api/users/'
export const urlBaseInventory = 'https://rich-ruby-sturgeon-garb.cyclic.app/api/inventory/'


/*  Local */

// export const urlBaseUsers = 'http://192.168.56.1:4500/api/users/'
// export const urlBaseInventory = 'http://192.168.56.1:4500/api/inventory/'


// Users
export const register = urlBaseUsers + 'register'
export const login = urlBaseUsers + 'login'
export const getcurrentuser = urlBaseUsers + 'get-current-user'
export const getAllDonorsOfOrg = urlBaseUsers + 'get-all-donors'
export const getAllHospOfOrg = urlBaseUsers + 'get-all-hospitals'



// Inventory
export const addInventory = urlBaseInventory + 'addInventory'
export const getInventory = urlBaseInventory + 'getInventory'





