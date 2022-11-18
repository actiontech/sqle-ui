export type MemberListFilterFormFields = {
  filterUserName?: string;
  filterInstance?: string;
};

export type MemberListFilterFormProps = {
  submit: (values: MemberListFilterFormFields) => void;
};
