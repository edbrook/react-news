import React, { Component } from 'react';
import './App.css';

const NEWSAPI_SOURCES_URL = "https://newsapi.org/v1/sources?language=en";
const NEWSAPI_ARTICLE_URL = "https://newsapi.org/v1/articles";
const NEWSAPI_ATTR_SOURCE = "source";
const NEWSAPI_ATTR_SORTBY = "sortBy";
const NEWSAPI_ATTR_APIKEY = "apiKey";

function buildArticleUrl(sourceId, sortBy) {
  return (
    NEWSAPI_ARTICLE_URL
      + "?" + NEWSAPI_ATTR_SOURCE + "=" + sourceId
      + "&" + NEWSAPI_ATTR_SORTBY + "=" + sortBy
      + "&" + NEWSAPI_ATTR_APIKEY + "=" + process.env.REACT_APP_NEWSAPI_KEY
  );
}

function NewsItem(props) {
  const { title, url, urlToImage, publishedAt } = props.item;
  const pubDate = new Date(Date.parse(publishedAt)).toLocaleDateString('uk');
  return (
    <div className="newsItem" onClick={()=>window.open(url)}>
      <img className="newsItemImg" alt="" src={urlToImage}/>
      <div className="newsItemTitle">{title}</div>
      <span className="newsItemPubDate">{pubDate}</span>
    </div>
  );
}

function NewsItemList(props) {
  const s = props.source;
  const items = props.items.map((i,j)=><NewsItem key={j} item={i}/>);
  return (
    <div>
      <div>
        <button className="backBtn" onClick={props.onBackClicked}>Back</button>
      </div>
      <span className="newsSourceName">{s.name}</span>
      <div className="newsItemList">
        {items}
      </div>
      <div>
        <button className="backBtn" onClick={props.onBackClicked}>Back</button>
      </div>
    </div>
  );
}

function NewsSource(props) {
  const s = props.source;
  return (
    <div className="newsSource" onClick={()=>{props.onClick(s)}}>
      <span className="newsSourceName">{s.name}</span>
      <div className="newsSourceDesc">{s.description}</div>
      <span className="newsSourceCat">{s.category}</span>
      <span className="newsSourceLang">{s.language}</span>
      <span className="newsSourceCountry">{s.country}</span>
    </div>
  );
}

function NewsSourceList(props) {
  const newsSources = props.sources.map((s) => (
    <NewsSource key={s.id}
      source={s}
      onClick={props.onSelectSource}/>
  ));
  return (
    <div>
      <h2>News Sources</h2>
      <div className="newsSourceList">
        {newsSources}
      </div>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSource: null,
      currentSourceUrl: null,
      sources: [],
      newsItems: [],
    };
  }

  componentWillMount() {
    this.updateSources(NEWSAPI_SOURCES_URL);
  }

  updateSources(url) {
    fetch(url)
      .then((res) => res.json())
      .then((sources) => {
        this.setState({ sources: sources.sources });
      });
  }

  updateNewsItems(url) {
    fetch(url)
      .then((res) => res.json())
      .then((items) => {
        this.setState({ newsItems: items.articles });
      });
  }

  clearCurrentSource = () => {
    this.setState({
      currentSource: null,
      currentSourceUrl: null,
      newsItems: [],
    });
  }

  handleSelectSource = (source) => {
    const sourceId = source.id;
    const orderBy = source.sortBysAvailable[0];
    const sourceUrl = buildArticleUrl(sourceId, orderBy);
    this.updateNewsItems(sourceUrl);
    this.setState({
      currentSource: source,
      currentSourceUrl: sourceUrl,
    });
  }

  render() {
    let content;
    if (this.state.currentSource) {
      content = <NewsItemList
        source={this.state.currentSource}
        items={this.state.newsItems}
        onBackClicked={this.clearCurrentSource}/>;
    } else {
      content = <NewsSourceList
        sources={this.state.sources}
        onSelectSource={this.handleSelectSource}/>;
    }
    return (
      <div>
        <h1>React News App ({process.env.NODE_ENV} mode)</h1>
        {content}
      </div>
    );
  }
}

export default App;
