defmodule TodomvcWeb.Schema.TodoTypes do
  use Absinthe.Schema.Notation

  @desc "Todo"
  object :todo do
    field(:title, :string)
    field(:completed, :boolean)
  end
end
