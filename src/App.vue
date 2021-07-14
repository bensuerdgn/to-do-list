<template>
  <div class="">
    <div class="content">
      <div
        class="
          header
          flex flex-col
          items-center
          py-5
          border-b-2 border-white
          shadow-md
          w-full
        "
      >
        <h1 class="uppercase font-semibold text-3xl text-primary mb-5">
          To Do List Board
        </h1>
        <div class="form-control">
          <div class="flex space-x-2 w-64">
            <input
              type="text"
              placeholder="Search"
              class="w-full input input-primary input-bordered h-10 rounded-box"
              v-model="search"
            />
          </div>
        </div>
      </div>
      <div
        class="
          board
          bg-gray-100
          mx-auto
          my-10
          p-5
          relative
          z-10
          max-w-4xl
          rounded-box
          shadow-2xl
        "
      >
        <div
          class="
            toDoList
            flex
            items-center
            justify-between
            my-6
            font-medium
            text-lg
          "
        >
          <div class="title">To Do</div>
          <div class="list flex items-center">
            <div class="date w-32">End date</div>
            <div class="status w-28">Status</div>
            <div class="priority w-24">Priority</div>
          </div>
        </div>
        <div
          class="
            add-ToDo
            my-2
            p-2
            border-primary border-dashed border-2
            rounded-box
          "
        >
          <a
            class="cursor-pointer"
            @click.prevent="
              openModal('');
              addButtonStatus = true;
              updateButtonStatus = false;
            "
          >
            <i class="fas fa-plus text-primary"> Add New To Do </i>
          </a>
        </div>
        <div v-for="todo in filtered" :key="todo.todoId">
          <div
            class="
              toDo
              flex
              items-center
              justify-between
              my-2
              bg-white
              rounded-box
              p-2
              border-border border
              hover:shadow-2xl
            "
            :class="'todo' + todo.todoId"
          >
            <div class="hidden">{{ (id = todo.todoId) }}</div>
            <div class="title">{{ todo.todoName }}</div>
            <div class="list flex items-center">
              <div class="date w-28">{{ todo.todoDate }}</div>
              <div
                class="status w-28 py-2 text-white rounded-box text-center"
                :class="getStatusClass(todo.todoStatus)"
              >
                {{ todo.todoStatus }}
              </div>
              <div class="priority w-24 text-center">
                <i
                  class="
                    fab
                    fa-font-awesome-flag
                    text-lg
                    border-border border-2
                    w-8
                    h-8
                    rounded-full
                  "
                  :class="getPriorityClass(todo.todoPriority)"
                >
                </i>
              </div>
              <div class="option">
                <div class="dropdown dropdown-left">
                  <div tabindex="0" class="m-1">
                    <i
                      class="fas fa-ellipsis-v text-gray-600 cursor-pointer p-1"
                    ></i>
                  </div>
                  <ul
                    class="
                      shadow
                      menu
                      dropdown-content
                      bg-base-100
                      rounded-box
                      w-24
                    "
                  >
                    <li>
                      <a
                        class="visible"
                        @click.prevent="
                          openModal(todo.todoId);
                          updateButtonStatus = true;
                          addButtonStatus = false;
                        "
                        >Update</a
                      >
                    </li>
                    <li>
                      <a
                        class="visible"
                        @click.prevent="deleteTodo(todo.todoId)"
                        >Delete</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal opacity-100 visible pointer-events-auto"
      v-if="modalStatus"
    >
      <div class="modal-box">
        <div class="form-control">
          <label class="label">
            <span class="label-text">To Do Name</span>
          </label>
          <input
            type="text"
            placeholder="To Do"
            class="input input-primary input-bordered"
            v-model="modalInfo.name"
          />
        </div>
        <div class="form-control mb-3">
          <label class="label">
            <span class="label-text">Set End Date</span>
          </label>
          <input
            type="date"
            placeholder="To Do"
            class="input input-primary input-bordered"
            v-model="modalInfo.date"
          />
        </div>
        <select
          class="select select-bordered select-primary max-w-xs mr-5"
          v-model="modalInfo.status"
        >
          <option disabled="disabled" selected="selected">
            Choose your to do status
          </option>
          <option>Not Started</option>
          <option>In Review</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select
          class="select select-bordered select-primary max-w-xs"
          v-model="modalInfo.priority"
        >
          <option disabled="disabled" selected="selected">
            Choose your to do priority
          </option>
          <option>Low Priority</option>
          <option>Medium Priority</option>
          <option>High Priority</option>
        </select>
        <div class="modal-action">
          <a
            v-if="addButtonStatus"
            class="btn btn-primary"
            @click.prevent="
              createToDo(
                id,
                modalInfo.name,
                modalInfo.date,
                modalInfo.status,
                modalInfo.priority
              );
              modalStatus = false;
            "
          >
            Add
          </a>
          <a
            v-if="updateButtonStatus"
            class="btn btn-primary"
            @click.prevent="
              updateTodo();
              modalStatus = false;
            "
            >Update</a
          >
          <a
            class="btn"
            @click.prevent="
              modalStatus = false;
              reset();
            "
            >Close</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "./firebase";
import gsap from "gsap";

const db = firebase.firestore();

export default {
  data() {
    return {
      todosData: [],
      modalInfo: {},
      search: "",
      modalStatus: false,
      addButtonStatus: false,
      updateButtonStatus: false,
      show: true,
    };
  },
  methods: {
    createToDo(id, name, date, status, priority) {
      var _this = this;
      if (name != "" && date != "" && status != "" && priority != "") {
        db.collection("todos")
          .add({
            todoName: name,
            todoDate: date,
            todoStatus: status,
            todoPriority: priority,
          })
          .then((doc) => {
            console.log(doc);
            _this.modalInfo.name = "";
            _this.modalInfo.date = "";
            _this.modalInfo.status = "";
            _this.modalInfo.priority = "";
          })
          .catch((error) => {
            console.log(error);
          });
      }
      gsap.fromTo(
        ".todo" + id,
        {
          y: 0,
          scale: 0,
          opacity: 0,
          ease: "easeInOut",
          onComplete() {},
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "easeInOut",
        }
      );
    },
    updateTodo() {
      console.log(this.modalInfo);
      var _this = this;
      db.collection("todos")
        .doc(_this.modalInfo.id)
        .update({
          todoId: _this.modalInfo.id,
          todoName: _this.modalInfo.name,
          todoDate: _this.modalInfo.date,
          todoStatus: _this.modalInfo.status,
          todoPriority: _this.modalInfo.priority,
        })
        .then(() => {
          console.log("updated");
          _this.modalInfo.name = "";
          _this.modalInfo.date = "";
          _this.modalInfo.status = "";
          _this.modalInfo.priority = "";
        })
        .catch((error) => {
          console.log(error);
          _this.modalInfo.name = "";
          _this.modalInfo.date = "";
          _this.modalInfo.status = "";
          _this.modalInfo.priority = "";
        });
    },
    deleteTodo(id) {
      gsap.to(".todo" + id, {
        x: 100,
        opacity: 0,
        scale: 0,
        onComplete() {
          db.collection("todos")
            .doc(id)
            .delete()
            .then(() => {
              console.log("deleted");
              this.name = "";
              this.date = "";
              this.status = "";
              this.priority = "";
            })
            .catch((error) => {
              console.log(error);
            });
        },
      });
    },
    openModal(id) {
      var _this = this;
      this.todosData.forEach((element) => {
        if (id == element.todoId) {
          _this.modalInfo.id = element.todoId;
          _this.modalInfo.name = element.todoName;
          _this.modalInfo.date = element.todoDate;
          _this.modalInfo.status = element.todoStatus;
          _this.modalInfo.priority = element.todoPriority;
        }
      });
      this.modalStatus = true;
    },
    reset() {
      this.modalInfo.name = "";
      this.modalInfo.date = "";
      this.modalInfo.status = "";
      this.modalInfo.priority = "";
    },
    getStatusClass(status) {
      if (status == "Not Started") {
        return "bg-error";
      } else if (status == "In Review") {
        return "bg-warning";
      } else if (status == "In Progress") {
        return "bg-info";
      } else {
        return "bg-success";
      }
    },
    getPriorityClass(priority) {
      if (priority == "High Priority") {
        return "text-error";
      } else if (priority == "Medium Priority") {
        return "text-info";
      } else {
        return "text-success";
      }
    },
  },
  created() {
    db.collection("todos").onSnapshot((snapshotChange) => {
      this.todosData = [];
      snapshotChange.forEach((doc) => {
        this.todosData.push({
          todoId: doc.id,
          todoName: doc.data().todoName,
          todoDate: doc.data().todoDate,
          todoStatus: doc.data().todoStatus,
          todoPriority: doc.data().todoPriority,
        });
      });
      console.log(this.todosData);
    });
  },
  mounted() {
    //window.addEventListener("load", this.readTodos);
    // Some random colors
    const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

    const numBalls = 50;
    const balls = [];

    for (let i = 0; i < numBalls; i++) {
      let ball = document.createElement("div");
      ball.classList.add("ball");
      ball.style.background = colors[Math.floor(Math.random() * colors.length)];
      ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
      ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
      ball.style.transform = `scale(${Math.random()})`;
      ball.style.width = `${Math.random()}em`;
      ball.style.height = ball.style.width;

      balls.push(ball);
      document.body.append(ball);
    }

    // Keyframes
    balls.forEach((el, i, ra) => {
      let to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 12,
      };

      let anim = el.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${to.x}rem, ${to.y}rem)` },
        ],
        {
          duration: (Math.random() + 1) * 2000, // random duration
          direction: "alternate",
          fill: "both",
          iterations: Infinity,
          easing: "ease-in-out",
        }
      );
      console.log(anim);
      console.log(ra);
      console.clear();
    });
  },
  computed: {
    filtered() {
      return this.todosData.filter(
        (data) =>
          !this.search ||
          data.todoName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  overflow: hidden;
}
.ball {
  position: absolute;
  border-radius: 100%;
  opacity: 0.7;
}
</style>
