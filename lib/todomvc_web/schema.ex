defmodule TodomvcWeb.Schema do
  use Absinthe.Schema

  import_types(TodomvcWeb.Schema.TodoTypes)
  alias TodomvcWeb.Resolvers

  query do
    @desc "Get all todos"
    field :todos, list_of(:todo) do
      resolve(&Resolvers.list_todos/3)
    end
  end

  mutation do
    field :submit_todo, :todo do
      arg(:title, non_null(:string))

      resolve(fn %{title: title}, _ ->
        todo_id =
          :crypto.strong_rand_bytes(64)
          |> Base.url_encode64()
          |> binary_part(0, 64)

        {:ok, %{id: todo_id, title: title, completed: false}}
      end)
    end

    field :update_todo, :todo do
      arg(:id, non_null(:string))
      arg(:title, :string)
      arg(:completed, :boolean)

      resolve(fn %{id: id, title: title, completed: completed}, _ ->
        {:ok, %{id: id, title: title, completed: completed}}
      end)
    end

    field :destroy_todo, :todo do
      arg(:id, non_null(:string))

      resolve(fn %{id: todo_id}, _ ->
        {:ok, %{id: todo_id}}
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

    field :todo_updated, :todo do
      config(fn _args, _ ->
        {:ok, topic: "todos"}
      end)

      trigger(
        :update_todo,
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

    field :todo_destroyed, :todo do
      config(fn _args, _ ->
        {:ok, topic: "todos"}
      end)

      trigger(
        :destroy_todo,
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
