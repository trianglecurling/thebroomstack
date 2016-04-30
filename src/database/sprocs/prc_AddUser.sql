/****** Object:  StoredProcedure [dbo].[prc_AddUser]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[prc_AddUser]
	-- Add the parameters for the stored procedure here
	@email nvarchar(500),
	@password nvarchar(128),
	@passwordSalt nvarchar(128),
	@firstname nvarchar(500),
	@lastname nvarchar(500),
	@displayname nvarchar(500)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Add person
	DECLARE @return_value INT;
	DECLARE @person_id UNIQUEIDENTIFIER;
	EXEC	@return_value = [dbo].[prc_AddPerson]
		@displayname = @displayname,
		@firstname = @firstname,
		@lastname = @lastname,
		@id = @person_id OUTPUT;

	INSERT INTO tbl_user ([person_id], [email], [password], [password_salt]) VALUES (@person_id, @email, @password, @passwordSalt);
END

GO
