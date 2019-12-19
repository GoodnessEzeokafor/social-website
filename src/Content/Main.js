import React, { Component } from 'react';
import Notebook from "../notebook.png"
import Identicon from 'identicon.js';

export default class Main extends Component {
constructor(props) {
    super(props);
    this.format_date = this.format_date.bind(this);

}

 format_date(t) {
    var date =  new Date(parseInt(t));
    return `${date.getDate()}`
  }
    render() {
        return (
            <div className="container-fluid mt-5">
            <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    const title = this.title.value
                    const content = this.content.value
                    this.props.SocialNetworkDapp.methods.createPost(title, content).send({from:this.props.account})
                    .once('receipt', (receipt)=> {
                      console.log(receipt)
                    })
                }}
            >
                <div className="form-group mr-sm-2">
                    <p>
                        <input 
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="Enter Post Title"
                        ref={(input) => {this.title = input}}
                        required
                        />
                    </p>
                    <p>
                        <input 
                        id="content"
                        type="text"
                        className = "form-control"
                        placeholder="Post What You Are Feeling"
                        ref={(input) => {this.content = input}}
                        required
                        />
                    </p>
                    <button 
                    type="submit"
                    className ="btn btn-primary btn-block"
                    >
                        Share
                    </button>
                </div>
            </form>
              {this.props.posts.map((post, key)=> {
                return(
              <div class="card" key={key}>
  
                <img class="card-img-top" width="100" height="320" src={Notebook} alt="Card image cap" />
                <div class="card-body">
                <h4 class="card-title"><a>{post.title}</a></h4>
                  <p class="card-text">
                  {post.content}
                  </p> 
                <p>
                <img className="ml-2" 
               width="30"
               height="30"
               src={`data:image/png;base64, ${ new Identicon(post.author, 30).toString()}`}
               />{post.author}
                  </p>
              <p>Tips: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH</p>
              <p>{this.format_date(post.timestamp)}</p>
                  <a  
                    className="btn btn-primary"
                    name={post.id}
                    onClick={(event) =>{
                        // call the tip function
                        let tipAmount = window.web3.utils.toWei('0.1','Ether')
                        this.props.SocialNetworkDapp.methods.tipPost(event.target.name).send({from:this.props.account, value:tipAmount})
                        .once('receipt', (receipt)=> {
                        console.log(receipt)
                        })
                    }}
                    >TIP 0.1 ETH</a>
                </div>
              </div>
                    )
              })}
            </div>
            </main>
          </div>
  
            
        );
    }
}