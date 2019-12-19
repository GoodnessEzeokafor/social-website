require('chai')
    .use(require('chai-as-promised'))
    .should()

const SocialNetwork = artifacts.require("./src/contracts/SocialNetwork.sol")

contract("Social Network Contract", ([deployer, author, tipper])=> {
    before("contract", async() =>{
        this.contract = await SocialNetwork.deployed()
    })
    it("checks if deployed successfully", async() => {
        const address = this.contract.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,null)
        assert.notEqual(address,'')
        assert.notEqual(address,undefined)
    })

    it("checks if name property works well", async() => {
        const name = await this.contract.social_name()
        assert.equal(name,"GoodyChat")
    })
    
    it("create posts", async() => {
        var new_post = await this.contract.createPost(
            "Post Title",
            "Post Content",
            {from:author}
        )
        const postCount = await this.contract.postCount()        
        new_post = new_post.logs[0].args

        // console.log()

        // SUCCESS
        assert.equal(postCount,1)
        assert.equal(new_post['0'].toNumber(), postCount)
        assert.equal(new_post['1'],"Post Title")
        assert.equal(new_post['2'], "Post Content")
        assert.equal(new_post['3'], 0)
        assert.equal(new_post['4'], author)


        // FAILURE
        await this.contract.createPost("", "Post Content",{from:author}).should.be.rejected;
        await this.contract.createPost("Post Ttle", "",{from:author}).should.be.rejected;
        

    })
    it("list posts", async() => {
        const postCount = await  this.contract.postCount()
        const posts = await this.contract.posts(postCount)
        assert.equal(postCount,1)
        assert.equal(posts['0'].toNumber(), postCount)
        assert.equal(posts['1'],"Post Title")
        assert.equal(posts['2'], "Post Content")
        assert.equal(posts['3'], 0)
        assert.equal(posts['4'], author)


    })
    it("allows users to tip posts",async() => {
        const postCount = await  this.contract.postCount()
        var tippedPost = await this.contract.tipPost(postCount,{
                                                        from:tipper,
                                                        value:web3.utils.toWei('3','Ether')
                                                    })
        tippedPost =  tippedPost.logs[0].args
        assert.equal(postCount,1)
        assert.equal(tippedPost['0'].toNumber(), postCount)
        assert.equal(tippedPost['1'],"Post Title")
        assert.equal(tippedPost['2'], "Post Content")
        assert.equal(tippedPost['3'].toString(), '3000000000000000000')
        assert.equal(tippedPost['4'], author)
        
        //check that author received funds
        let newAuthorBalance
        newAuthorBalance = await web3.eth.getBalance(author)
        newAuthorBalance = await web3.utils.BN(newAuthorBalance)


        let tipAmount
        tipAmount = web3.utils.toWei('3', 'Ether')
        tipAmount = new web3.utils.BN(tipAmount)

        const expectedBalance = oldAuthorBalance.add(tipAmount)
        assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
    })

})  