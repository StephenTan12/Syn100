enum ERRORS {
    ItemIdNotInt,
    ItemNotFound
}

const ERRORLOOKUP = new Map<ERRORS, Error>();
ERRORLOOKUP.set(ERRORS.ItemIdNotInt, Error("Item not of type int"));
ERRORLOOKUP.set(ERRORS.ItemNotFound, Error("Item not found"))

export default {ERRORS, ERRORLOOKUP}