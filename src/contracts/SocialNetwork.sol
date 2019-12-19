pragma solidity ^0.5.0;


contract SocialNetwork{
    string public social_name;
    uint public postCount = 0;
    mapping (uint=>Post) public posts;
    /*
    Create Posts
    List all the posts
    Tip Post with cryptocurrency 
    */

    struct Post{
        uint id; // id
        string title;
        string content; // content
        uint tipAmount; // tipaount
        address payable author; // post creator
        uint timestamp;  
    }
    event PostCreateEvent(
        uint id,
        string title,
        string content,
        uint tipAmount,
        address payable author,
        uint timestamp
    );

    event TippedPostEvent(
        uint id,
        string title,
        string content,
        uint tipAmount,
        address payable author,
        uint timestamp
     );


    constructor() public{
        // block.timestamp
        social_name = "GoodyChat";
    }

    function createPost(string memory _title,string memory _content)public{
        require(bytes(_title).length > 0, "Enter Value For Post Titl");
        require(bytes(_content).length > 0, "Enter Value For Post Content");
        postCount++;
        posts[postCount] = Post(
            postCount,
            _title,
            _content,
            0,
            msg.sender,
            now   
     );
     emit PostCreateEvent(
         postCount,
         _title,
         _content,
         0,
         msg.sender,
         now
     );

    }

    function tipPost(uint _id)public payable{
        //fetch the post
        Post memory _post = posts[_id];
          
        // Fetch th author
        address payable _author = _post.author;
        // pay the author
        address(_author).transfer(msg.value);
        // Increment the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        posts[_id] = _post;
        // trigger an event

        emit TippedPostEvent(
            _id,
            _post.title, 
            _post.content,
            _post.tipAmount,
            _author,
            now
        );
    }
}
