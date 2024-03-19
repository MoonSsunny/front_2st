export function jsx(type, props, ...children) {
  return {
    type,
    props,
    children,
  };
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.type);

  if (node.props !== null) {
    for (const [key, value] of Object.entries(node.props)) {
      element.setAttribute(key, value);
    }
  }

  node.children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

function updateAttributes(target, newProps, oldProps = {}) {
  // newProps들을 반복하여 각 속성과 값을 확인하고 업데이트 또는 추가

  newProps = newProps ?? {};
  oldProps = oldProps ?? {};

  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] && oldProps[key] == value) {
      continue;
    }
    target.setAttribute(key, value);
  }

  // oldProps을 반복하여 더 이상 존재하지 않는 속성을 확인하고 제거
  for (const key in oldProps) {
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNodes[index]);
  }

  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  if (
    typeof newNode === 'string' &&
    typeof oldNode === 'string' &&
    newNode !== oldNode
  ) {
    return parent.replaceChild(
      document.createTextNode(newNode),
      parent.childNodes[index]
    );
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행

  // 속성 업데이트
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 자식 노드들에 대해 재귀적으로 render 호출
  const newLength = newNode.children?.length;
  const oldLength = oldNode.children?.length;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
