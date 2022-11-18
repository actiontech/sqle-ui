export type MemberGroupListFilterFormFields = {
  filterUserGroupName?: string;
  filterInstance?: string;
};

export type MemberGroupListFilterFormProps = {
  submit: (values: MemberGroupListFilterFormFields) => void;
};
