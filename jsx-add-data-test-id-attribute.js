function isLowerCase(str) {
  return str === str.toLowerCase()
}

function removeSlashes(str, replaceWith = "_") {
  return str.split("/").join("_")
}

function butLast(arr) {
  return arr.slice(0, arr.length - 1)
}

function removeExtension(filePath) {
  return butLast(filePath.split(".")).join(".")
}

export default function transformer(file, api) {
  const j = api.jscodeshift

  let i = 0
  return j(file.source)
    .find(j.JSXElement)
    .forEach(p => {
      if ((p.node.openingElement.name.name) && allowedElements.includes(p.node.openingElement.name.name)) {
        i++
        if (
          !p.node.openingElement.attributes.some(
            attribute =>
              attribute &&
              attribute.name &&
              attribute.name.name === defineElement
          )
        ) {
          j(p).replaceWith(
            j.jsxElement(
              j.jsxOpeningElement(
                j.jsxIdentifier(p.node.openingElement.name.name),
                p.node.openingElement.attributes.concat(
                  j.jsxAttribute(
                    j.jsxIdentifier(defineElement),
                    j.literal(
                      removeSlashes(removeExtension(file.path).split('app/')[1]).toLowerCase()+"-"+(p.node.openingElement.name.name).toLowerCase()+'-'+
                        i++
                    )
                  )
                ),
                p.node.openingElement.selfClosing
              ),
              p.node.closingElement,
              p.node.children
            )
          )
        }
      }
    })
    .toSource()
}
