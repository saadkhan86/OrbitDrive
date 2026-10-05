DO $$
BEGIN
    DELETE FROM users;

    DELETE FROM organization_members;
    DELETE FROM organization_invitations;
    DELETE FROM organizations;

END;
$$;