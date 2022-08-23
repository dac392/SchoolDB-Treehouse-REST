/**
 * Abstraction of a try/catch block, used for code readability.
 * @param {CallBack} cb - The function used as a callback
 * @returns 
 */
exports.handler = (cb)=>{
    return async (req, res, next)=>{
        try{
            await cb(req, res, next);
        }catch(error){
            next(error);
        }
    }
}