{
  function toCommand(c) {
    return {
      type: "COMMAND_PARAM",
      value: c
    };
  }

}

start
  = commandsOrParams+

commandsOrParams
  = c:commandOrParam c1:(" "+ c:commandOrParam {return c;})*
  {
    if(c1) {
      return toCommand([c].concat(c1))
    }
    else {
      return toCommand([c])
    }
  }

commandOrParam
  = c:characters

characters
  = c:[^" "]+ {return c.join("")}
