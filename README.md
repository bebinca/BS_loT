# BS_loT
2021 ZJU BS

## 目录结构

* client-mqtt
  * backend：原有的IDEA iotclient工程，有做微小的修改
  * mqtt：从mqtt服务器接收数据发给后端
* frontend-backend
  * frontend：前端，基于React
  * backend：后端，基于Flask

## 开发环境设置

可以按照以下顺序操作：

* 启动mosquitto服务器。

* client-mqtt/backend：

  原有的IDEA iotclient工程，按照原来方式运行即可。

  jar文件在target目录下，可以直接运行`java -jar iotclient-1.0.0.jar`

* frontend-backend/backend：

  后端程序，可能需要配置，设置python虚拟环境：

  ```sh
  $ pipenv install --dev
  $ pipenv shell
  ```

  或者直接在本地安装环境：

  ```sh
  $ pip install -r requirements.txt
  ```

  运行：

  ```sh
  $ flask init-db # 建表并初始化，如果建过表会清空数据
  $ flask run # 启动后端
  ```

* client-mqtt/mqtt：

  直接运行`python mqtt.py`即可，如果缺失库需要安装。

* frontend-backend/frontend：

  ```sh
  $ npm install
  $ npm start
  ```


其中，client-mqtt/mqtt和frontend-backend/frontend的运行一定要在frontend-backend/backend后端程序之后，因为要和后端建立连接。
