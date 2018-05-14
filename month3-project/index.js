const users =[];

const user = {
	userId:'', // key
	name:'',
	password:'',
	createdDate:'',
	updatedDate:'',
	posts:[], // 내가 포스트한 목록 - need id of the post
	comments:[], // 내가 뎃글을 남긴 목록
	likes:[], // 내가 좋아하는 목록
	watches:[], // 내가 지켜보는 목록
};

const post = {
	postId:'', // key
	writer:'', // 포스트를 작성한 userId
	tit:'',
	img:[], // 최소 한개 이상의 이미지가 필요함 // 메인이미지는 0번째놈
	content:'', // 내부적으로 작성하기 나름이지만 일반적으로 긴 텍스트 형태를 생각.
	like:0,
	watch:0,
	comment:[],
	createdDate:'',
	updatedDate:'',
};
const comment = {
	commentId:'',
	userId:'',
	postId:'',
	createdDate:'',
};
