type Some<T> = {
  status: "some";
  value: T;
};

type None = {
  status: "none";
};

export type Option<T> = Some<T> | None;
