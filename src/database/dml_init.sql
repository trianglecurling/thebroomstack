-- Positions
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Skip');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Vice');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Second');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Lead');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Outer');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), 'Inner');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), '1st Alternate');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), '2nd Alternate');
INSERT INTO tbl_position ([id], [name]) VALUES ((SELECT NEWID()), '3rd Alternate');

-- Memberships
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Lifetime', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Full', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('League', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Student', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Family (primary)', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Family (beneficiary)', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Reciprocal', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Novice', 0);
INSERT INTO tbl_membershiptype ([type], [cost]) VALUES ('Social', 0);
