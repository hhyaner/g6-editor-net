import React from 'react';
import uuidv4 from 'uuid/v4';
import Contextmenu from './Contextmenu';
import Editor from './Editor';
import Page from './Page';
import G6Editor from '@antv/g6-editor';
import './koni.css';
import graph from '../data/graph';
import ellipseForce from './d3-ellipse-force';
import * as d3 from 'd3';

const Util = G6Editor.Util;
G6Editor.Koni.registerNode('graph-model', {
  draw(item) {
    const group = item.getGraphicGroup();
    const label = this.drawLabel(item);
    const keyShape = this.drawKeyShape(item);
    this.drawIcon(item);
    label && Util.toFront(label, group);
    return keyShape;
  },
  drawIcon(item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const { icon } = model;

    group.addShape('image', {
      attrs: {
        x: -7,
        y: -7,
        img: icon,
      },
    });
  }
});

export default class Koni extends Editor {
  componentDidMount() {
  }

  componentDidMount() {
    super.componentDidMount();
    const editor = this.editor;
    const page = editor.getCurrentPage();

    this.page = page;

    this.renderD3Relation();

    this.bindEvent();
  }

  bindEvent = () => {
    // 鼠标拖拽结束事件
    this.page.on('contextmenu', (ev) => {
      if (ev.item.type === 'node') {
        console.log('拖动节点', ev.item);
        this.page.update(ev.item, {
          x: ev.x,
          y: ev.y,
        });
      }
    });

     // 鼠标拖拽事件
    this.page.on('drag', (ev)=>{
      if (ev.item.type === 'node') {
        console.log('拖动节点', ev.item);
        this.page.update(ev.item, {
          x: ev.x,
          y: ev.y,
        });
      }
    });

    this.page.on('dragend', (ev)=>{
      if (ev.item.type === 'node') {
        console.log('拖动节点', ev.item);
        this.page.update(ev.item, {
          x: ev.x,
          y: ev.y,
        });
      }
    });           
  }

  renderD3Relation = () => {
    var width = 960,
    height = 600;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var nd;
    for (var i=0; i<graph.nodes.length; i++) {
      nd = graph.nodes[i];
      nd.rx = nd.id.length * 4.5; 
      nd.ry = 12;
    } 

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("collide", ellipseForce(6, 0.5, 5))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // var link = svg.append("g")
    //     .attr("class", "link")
    //   .selectAll("line")
    //   .data(graph.links)
    //   .enter().append("line")
    //     .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    // var node = svg.append("g")
    //     .attr("class", "node")
    //   .selectAll("ellipse")
    //   .data(graph.nodes)
    //   .enter().append("ellipse")  
    //     .attr("rx", function(d) { return d.rx; })
    //     .attr("ry", function(d) { return d.ry; })
    //     .attr("fill", function(d) { return color(d.group); })
        // .call(d3.drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended));

    // var text = svg.append("g")
    //     .attr("class", "labels")
    //   .selectAll("text")
    //   .data(graph.nodes)
    //   .enter().append("text")  
    //     .attr("dy", 2)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) {return d.id})
    //     .attr("fill", "white");


    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    // simulation.force("link")
    //     .links(graph.links);

    const me = this;
    let index = 0;
    function ticked() {
      if (index > 10) {
        return ;
      }
      index++;

      // 在Editor上绘制node
      const nodes = simulation.nodes().map(n => ({
        ...n,
        // shape: 'graph-model',
        label: n.id,
      }));


      // console.log(nodes, graph.links);

      me.page.read({
        nodes,
        edges: graph.links.map(n => ({
          ...n,
          id: uuidv4(),
          label: n.source,
        })),
      });


      // link
      //     .attr("x1", function(d) { return d.source.x; })
      //     .attr("y1", function(d) { return d.source.y; })
      //     .attr("x2", function(d) { return d.target.x; })
      //     .attr("y2", function(d) { return d.target.y; });

      // node
      //     .attr("cx", function(d) { return d.x; })
      //     .attr("cy", function(d) { return d.y; });
      // text
      //     .attr("x", function(d) { return d.x; })
      //     .attr("y", function(d) { return d.y; });
        

    }

    // function dragstarted(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    //   d.fx = d.x;
    //   d.fy = d.y;
    // }

    // function dragged(d) {
    //   d.fx = d3.event.x;
    //   d.fy = d3.event.y;
    // }

    // function dragended(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0);
    //   d.fx = null;
    //   d.fy = null;
    // }
  }

  render() {
    return <div className="editor">
      <div style={{ height: '42px' }}></div>
      <div className="bottom-container">
        <Contextmenu editor={this.editor} />
        <Page editor={this.editor}
          createPage={container => {
            const height = window.innerHeight - 38;
            const koni = new G6Editor.Koni({
              graph: {
                container,
                height
              },
              align: {
                grid: true
              }
            });

            return koni;
          }}
        />
      </div>
    </div>;
  }
}
