use st_register;

desc user;
select * from user;

desc admission;
select * from admission;

insert into user (mob, f_name, l_name, m_name, pass, email) values(9876543210, 'prasad', 'b', 'c', 'pass', 'pb@gmail.com');
1	24	No	Mr	1	Male	123456789012	2000-05-10 05:30:00.000000	411001	Yadav	OBC	Pune	Sunita	Hindu	Maharashtra	Haveli	MG Road, Pune

insert into admission (handicap, title, user, gender, aadhaar, dob, pin, caste, caste_cate, district, mother, religion, state, taluka, addr) values(No, 'Mr.', 2, 'male', 123456789012, '2000-05-10', 411001, 'Yadav', 'OBC', 'Pune', 'Sunita', 'Hindu', 'Maharashtra', 'Haveli', 'MG Road, Pune');
