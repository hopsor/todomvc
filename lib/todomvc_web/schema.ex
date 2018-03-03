defmodule TodomvcWeb.Schema do
  use Absinthe.Schema

  import_types(TodomvcWeb.Schema.TodoTypes)

  query do
  end

  mutation do
    field :submit_todo, :todo do
      arg(:title, non_null(:string))

      resolve(fn %{title: title}, _ ->
        {:ok, %{title: title, completed: false}}
      end)
    end
  end

  subscription do
    field :todo_added, :todo do
      config(fn _args, _ ->
        {:ok, topic: "todos"}
      end)

      trigger(
        :submit_todo,
        topic: fn _todo ->
          "todos"
        end
      )

      resolve(fn todo, _, _ ->
        # this function is often not actually necessary, as the default resolver
        # for subscription functions will just do what we're doing here.
        # The point is, subscription resolvers receive whatever value triggers
        # the subscription, in our case a comment.
        {:ok, todo}
      end)
    end
  end
end
