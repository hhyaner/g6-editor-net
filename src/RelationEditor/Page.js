import React from 'react';
import G6Editor from '@antv/g6-editor';

class Page extends React.Component {
  createPage(container) {
    const height = window.innerHeight - 38;
    return new G6Editor.Flow({
      graph: {
        container,
        height
      },
      align: {
        grid: true
      }
    });
  }
  getCreatePage() {
    const { createPage } = this.props;
    return createPage ? createPage : this.createPage;
  }
  componentDidMount() {
    const { editor } = this.props;
    const createPage = this.getCreatePage();
    const page = createPage(this.pageContainer);
    editor.add(page);
  }
  render() {
    return (<div className="page" ref={el => { this.pageContainer = el; }}></div>);
  }
}

export default Page;
