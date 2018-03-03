defmodule TodomvcWeb.Resolvers do
  def list_todos(_parent, _args, _resolution) do
    {:ok, []}
  end
end
