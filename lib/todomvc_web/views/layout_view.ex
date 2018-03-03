defmodule TodomvcWeb.LayoutView do
  use TodomvcWeb, :view

  def websocket_url() do
    Application.get_env(:todomvc, :websocket_url)
  end
end
