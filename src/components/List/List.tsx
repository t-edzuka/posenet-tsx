import React from "react";

type Props = {
  data: gitHubItem[];
  renderEmpty: string;
  renderItem: (item: gitHubItem) => JSX.Element;
};

type gitHubItem = {
  name: string;
  elevation: number;
};

const enumerateItem = (
  item: gitHubItem,
  i: number,
  renderItem: (item: gitHubItem) => JSX.Element
) => {
  return <li key={i}>renderItem(item)</li>;
};

export const implRenderItem = (item:gitHubItem) => {
  const {name, elevation} = item;
  const elvString = elevation.toLocaleString();
  return(<>{name} - {elvString}</>);
}

const List: React.VFC<Props> = (props) => {
  const { data, renderItem, renderEmpty } = props;
  if (!data.length) {
    return <>{renderEmpty}</>;
  } else {
    return <ul>{data.map((item, i) => enumerateItem(item, i, renderItem))}</ul>;
  }
};

export default List;
