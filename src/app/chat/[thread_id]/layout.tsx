import { Fragment } from 'react';

export default async function Layout(props: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <Fragment>
      {props.children}
      <div className="debug">{props.modal}</div>
    </Fragment>
  );
}
